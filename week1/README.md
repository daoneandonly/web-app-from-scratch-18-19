# Web app with Pokémon TCG api

I'm using the [Pokémon TCG developers API](https://pokemontcg.io/) to load in all info about a Pokémon Trading Card and show its content HTML.

![Preview](../img/week1capture.png)

## Live demo

[You can find the Live Demo here.](https://daoneandonly.github.io/web-app-from-scratch-18-19/week1/index.html)

## Features

### Input change

Currently, the app starts with the API request for the card `base2-60`. With the number input field you change the `currentNumber` variable that changes the card which gets requested. It still uses the set `base2-`. An eventListener is set on change on the number input field.

### Type Symbol Spriting

The app uses a sprite to render the image of any type symbol. The `costToImage(lightning)` function renders

```html
<i class='energy lightning'>
```
where lightning corresponds to the sprite class in css.


## Planned features

* Requesting a set instead of a single cards
* Adding routing to go from set view to single card
* Changing requested set and cards through Input

## Planned refactors

* Using map() instead of forEach() to loop through template literals
* Using promise instead of  XHR
