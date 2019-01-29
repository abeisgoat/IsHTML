# IsHTML for Tiny mode
Create UI elements via HTML / TSX in Unity's Tiny (for Web).

![IsHTML Preview GIF](https://thumbs.gfycat.com/WhoppingGiantHermitcrab-size_restricted.gif)

## About
As of this writing (Tiny@0.13.4), Unity's Project Tiny (a.k.a. Tiny mode) has minimal support for rich, responsive UIs via the built-in `UILayout` methods. `IsHTML` is a hack which uses the existing Tiny `UILayout` then expands it by allowing HTML to be rendered in place of (on top of) the normal content.

IsHTML maps HTML directly onto a `RectTransform` which means changes to `RectTransform` (with the exception of rotation) will modify the elements position. For an example of tweening an `IsHTML` blob, see the [example code](https://github.com/abehaskins/IsHTML/blob/master/Scripts/Tag_BounceBehavior.tsx#L19).

This repo contains a configured project along with the required components (IsHTML) and behaviors (IsHTMLBehavior).

If you like this project, [follow me on Twitter](https://twitter.com/abeisgreat).

## Basic Usage (Static HTML)
If you'd like to use `IsHTML` just for static HTML which wont change (tutorial pages, etc), then you can follow these steps to create an entity which is filled with HTML.

1. Copy `Components/IsHTML.uttype`, `Components/IsHTMLConfiguration.uttype`, and `Scripts/IsHTMLBehavior.ts` into your project.
2. Create an entity with a `UICanvas` parent, a `RectTransform`, a `SpriteRenderer`, a `SpriteRendererOptions` and an `IsHTML` entity.
3. Edit the `html` field on the `IsHTML` component with the content which will replace the sprite render during runtime.
4. Open your project file in the Inspector, click on the `IsHTMLConfiguration` to specify game-wide CSS styles. Check the sample project for an example.

## Advanced Usage (Interactive HTML via `jsx`/`tsx`)
If you'd like to do advanced interaction / event propegation (clicks, input value changes), then `IsHTML` supports the use of `tsx` (a simple `HTML-in-Typescript` templating language) for creating dynamic content.

First, look at the [example code](https://github.com/abehaskins/IsHTML/blob/master/Scripts/Tag_BounceBehavior.tsx#L41) for the bouncing box.

After following the basic steps, you'll need to...

5. Copy `tsconfig.override.json` to the same location in your project. This tells Tiny to load `.tsx` files. To ensure editor support, any file which uses `tsx` templates, must have the `.tsx` extension instead of `ts`(like `Scripts/Tag_BounceBehavior.tsx`)
6. Use the `IsHTMLService.SetHTML` to set your content like in the [TagBounce_Behavior](https://github.com/abehaskins/IsHTML/blob/master/Scripts/Tag_BounceBehavior.tsx#L39) or bind events like in [TagInput_Behavior](https://github.com/abehaskins/IsHTML/blob/master/Scripts/Tag_InputBehavior.tsx#L12).

## Notes & Issues
* `IsHTML` contains a copy of [HDPI_Hacks](https://gist.github.com/abehaskins/bbd6f0d87d91a9049fdd7941e0adab90) to correct Screen DPI.
* `IsHTML` is only tested against Tiny projects built for the browser. I don't know anything about PlayableAds.

## License
MIT
