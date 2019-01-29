/*
    This example behavior demonstrates tweening an IsHTML element. It is not required for IsHTML to function.
 */
namespace game {

    export class Tag_BounceBehaviorFilter extends ut.EntityFilter {
        tag: game.Tag_Bounce;
        entity: ut.Entity;
        rect: ut.UILayout.RectTransform;
        is_html: game.IsHTML;
    }

    export class Tag_BounceBehavior extends ut.ComponentBehaviour {

        data: Tag_BounceBehaviorFilter;

        // ComponentBehaviour lifecycle events
        // uncomment any method you need
        
        // this method is called for each entity matching the Tag_BounceBehaviorFilter signature, once when enabled
        OnEntityEnable():void {
            ut.Tweens.TweenService.addTween(
                this.world,
                this.data.entity,
                ut.UILayout.RectTransform.anchoredPosition.y,
                this.data.rect.anchoredPosition.y,
                this.data.rect.anchoredPosition.y + 200,
                4,
                0,
                ut.Core2D.LoopMode.PingPong,
                ut.Tweens.TweenFunc.InOutBounce,
                false
            );
        }
        
        // this method is called for each entity matching the Tag_BounceBehaviorFilter signature, every frame it's enabled
        OnEntityUpdate():void {
            const pos = Math.floor(this.data.rect.anchoredPosition.y);
            const color = pos > 100? "blue" : "red";
            const text = pos > 100? "white": "black";
            IsHTMLService.SetHTML(this.data.is_html, <div style={`background-color: ${color}; color: ${text}`}>
                Y: {pos}
            </div>);

        }

        // this method is called for each entity matching the Tag_BounceBehaviorFilter signature, once when disabled
        //OnEntityDisable():void { }

    }
}
