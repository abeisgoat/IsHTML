const getRandomID = () =>
  Math.random()
    .toString(36)
    .replace(".", "");

namespace game {
  export class IsHTMLBehaviorFilter extends ut.EntityFilter {
    entity: ut.Entity;
    rect: ut.UILayout.RectTransform;
    is_html: game.IsHTML;
    sprite_renderer: ut.Core2D.Sprite2DRenderer;
  }

  export class IsHTMLBehavior extends ut.ComponentBehaviour {
    data: IsHTMLBehaviorFilter;
    elements: { [element_id: string]: HTMLElement } = {};

    OnEntityEnable(): void {
      let style = document.querySelector("style.is_html_styles");

      if (!style) {
        style = document.createElement("style");
        style.setAttribute("class", "is_html_styles");
        document.body.appendChild(style);
      }

      style.innerHTML = this.world.getConfigData(game.IsHTMLConfiguration).css;

      const tag = document.createElement("div");
      const id = `isHTML_${getRandomID()}`;
      tag.setAttribute("id", id);
      tag.setAttribute("class", "is_html");
      tag.setAttribute(
        "style",
        "top: 0px; left; 0px; width: 0px; 0px; position: absolute; display: grid;"
      );
      document.body.appendChild(tag);

      const options = [
        {
          text: "Yes",
          action: () => {
            alert("You saidy yes");
          }
        },
        {
          text: "No",
          action: () => {
            alert("You said nah");
          }
        }
      ];

      this.data.is_html._selector = `#${id}`;
      IsHTMLService.SetHTML(this.data.is_html, this.data.is_html.html);
      this.elements[this.data.is_html._selector] = tag;
      this.data.sprite_renderer.color.a = 0;
    }

    OnEntityUpdate(): void {
      let size = ut.UILayout.UILayoutService.getRectTransformSizeOfEntity(
        this.world,
        this.data.entity
      );

      let displayInfo = this.world.getConfigData(ut.Core2D.DisplayInfo);
      let displaySize = new Vector2(displayInfo.width, displayInfo.height);

      // Todo: Take into account sizeDelta
      let multiple = displaySize.y / 1080 / window.devicePixelRatio;
      if (multiple == Infinity) return;

      const el = this.elements[this.data.is_html._selector];

      if (!el) throw this.data.is_html._selector;
      const offset = new Vector2(
        (size.x / (1 / this.data.rect.pivot.x)) * multiple,
        (size.y / (1 / this.data.rect.pivot.y)) * multiple
      );

      const topLeftAnchorMin = new Vector2(
        (this.data.rect.anchorMin.x + this.data.rect.anchorMax.x) / 2,
        Math.abs(
          (this.data.rect.anchorMin.y + this.data.rect.anchorMax.y) / 2 - 1
        )
      );

      el.style.width = `${size.x * multiple}px`;
      el.style.height = `${size.y * multiple}px`;

      el.style.left = `${(displaySize.x / window.devicePixelRatio) *
        topLeftAnchorMin.x +
        this.data.rect.anchoredPosition.x * multiple -
        offset.x}px`;
      el.style.top = `${(displaySize.y / window.devicePixelRatio) *
        topLeftAnchorMin.y -
        this.data.rect.anchoredPosition.y * multiple -
        offset.y}px`;
    }

    // this method is called for each entity matching the IsHTMLBehaviorFilter signature, once when disabled
    //OnEntityDisable():void { }
  }

  export class IsHTMLService {
    static addEventListener(
      is_html: game.IsHTML,
      selector: string,
      event: string,
      callback: EventListener
    ) {
      const el = document.querySelector(`${is_html._selector} ${selector}`);
      el.addEventListener(event, callback);
    }

    static SetHTML(is_html: game.IsHTML, html: string) {
      document.querySelector(is_html._selector).innerHTML = html;
    }

    static CreateElement(tag, args, ...children) {
      const IsHTMLEvents = (window as any).IsHTMLEvents || {};

      const stringed_args = Object.keys(args || [])
        .map(key => {
          let value = args[key];

          if (typeof value == "function" && key.indexOf("on") == 0) {
            const callbackId = "_" + getRandomID();
            IsHTMLEvents[callbackId] = value;
            value = `IsHTMLEvents.${callbackId}()`;
          } else if (typeof value == "object") {
            value = JSON.stringify(value);
          }

          return `${key}="${value}"`;
        })
        .join(" ");

      (window as any).IsHTMLEvents = IsHTMLEvents;
      return `<${tag} ${stringed_args}>
        ${children
          .map(child => {
            if (Array.isArray(child)) {
              return child.join("\n");
            } else {
              return child;
            }
          })
          .join("\n")}
    </${tag}>`;
    }
  }
}

/*
This is a hack to work around https://forum.unity.com/threads/bug-renderer-fails-to-take-into-account-screen-dpi.601087/

Instructions:
Put the following code in a Behavior / System which gets included in your game.
Place the code NEXT to your namespace definition i.e...

(function HDPI_Hacks_By_abeisgreat() {
  ...
})();
namespace game {
  ...
}

It should not go inside the namespace.
*/

(function HDPI_Hacks_By_abeisgreat() {
  const w = window as any;

  const initialize_hack = () => {
    console.log("Initializing HDPI hacks v6 by @abeisgreat");
    const fakeMouseEventFn = ev => {
      const ut_HTML = w.ut._HTML;
      const fakeEvent = {
        type: ev.type,
        pageX: ev.pageX * window.devicePixelRatio,
        pageY: ev.pageY * window.devicePixelRatio,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      ut_HTML.mouseEventFn(fakeEvent);
      ev.preventDefault();
      ev.stopPropagation();
    };

    const fakeTouchEventFn = ev => {
      const ut_HTML = w.ut._HTML;
      const changedTouches = [];
      for (var index = 0; index < ev.changedTouches.length; index++) {
        const touch = ev.changedTouches[index];
        changedTouches.push({
          identifier: touch.identifier,
          pageX: touch.pageX * window.devicePixelRatio,
          pageY: touch.pageY * window.devicePixelRatio
        });
      }
      const fakeEvent = {
        type: ev.type,
        changedTouches,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      ut_HTML.touchEventFn(fakeEvent);
      ev.preventDefault();
      ev.stopPropagation();
    };

    window.addEventListener("resize", function() {
      const ut = w.ut;

      ut._HTML.onDisplayUpdated(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio,
        window.screen.width * window.devicePixelRatio,
        window.screen.height * window.devicePixelRatio,
        -1
      );

      ut._HTML.canvasElement.style.width = `${window.innerWidth}px`;
      ut._HTML.canvasElement.style.height = `${window.innerHeight}px`;

      ut._HTML.stopResizeListening();
      const mouseEvents = ["down", "move", "up"];
      const touchEvents = ["touch", "cancel", "move", "start"];

      mouseEvents.forEach(type => {
        const eventType = `mouse${type}`;
        ut._HTML.canvasElement.removeEventListener(eventType, fakeMouseEventFn);
        ut._HTML.canvasElement.addEventListener(eventType, fakeMouseEventFn);
      });

      touchEvents.forEach(type => {
        const eventType = `touch${type}`;
        ut._HTML.canvasElement.removeEventListener(eventType, fakeTouchEventFn);
        ut._HTML.canvasElement.addEventListener(eventType, fakeTouchEventFn);
      });

      setTimeout(function() {
        mouseEvents.forEach(type => {
          ut._HTML.canvasElement.removeEventListener(
            `mouse${type}`,
            ut._HTML.mouseEventFn
          );
        });

        touchEvents.forEach(type => {
          ut._HTML.canvasElement.removeEventListener(
            `touch${type}`,
            ut._HTML.touchEventFn
          );
        });
      }, 100);
    });
    window.dispatchEvent(new Event("resize"));
  };

  const intervalID = setInterval(() => {
    const w = window as any;
    const ut = w.ut;
    if (ut._HTML.canvasElement && w.known_ut_HTML !== ut._HTML) {
      w.known_ut_HTML = ut._HTML;
      clearInterval(intervalID);
      initialize_hack();
    }
  }, 10);
})();
