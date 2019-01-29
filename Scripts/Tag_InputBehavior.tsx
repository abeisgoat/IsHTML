
namespace game {

    export class Tag_InputBehaviorFilter extends ut.EntityFilter {
        is_html: game.IsHTML;
    }

    export class Tag_InputBehavior extends ut.ComponentBehaviour {

        data: Tag_InputBehaviorFilter;

        OnEntityEnable():void {
            let msg = "";
            
            const updateMessage = (event: KeyboardEvent) => {
                const el = (event.srcElement as HTMLInputElement);
                msg = el.value;
            };

            const sendMessage = () => {
                alert(msg);
            };

            IsHTMLService.SetHTML(this.data.is_html, <div style="display: grid; grid-template-columns: 1fr fit-content(100%);">
                <input onkeyup={updateMessage} placeholder="Type a message..."/>
                <button onclick={sendMessage}>Send</button>
            </div>);
        }

    }
}
