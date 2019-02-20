## Single Card

A single card on the detail page gets rendered as follows:

JS card output HTML

```javascript
<section class="card">
  <section class="left half">
    <img class="previewImage" src="${data.imageUrlHiRes}" />
  </section>
  <section class="right half">
    <section class="name">
      <h3>${data.name}</h3>
      <h3>HP: ${data.hp}</h3>
      <p>${data.subtype}</p>
      <p>Type: ${costToImage(data.types)}</p>
    </section>
    <section class="attack">${renderAttacks(data.attacks)}</section>
    <section>
      <h3>Artist</h3>
      <p>${data.artist}</p>
    </section>
  </section>
</section>
```

---

## Attacks

In the `<section class="attack">` element, the individual attacks gets rendered with the `renderAttacks()` function.

JS attack output HTML

```javascript
function renderAttacks(attacks) {
  var listOfAttacks = ''
  if (attacks != undefined){
  attacks.forEach(function(attack) {
    listOfAttacks +=
      `<section class='singleAttack'>
        ${costToImage(attack.cost)}
        <h3>${attack.name}</h3>
        <p>${attack.text}</p>
        <h3 class='damage'>${attack.damage}</h3>
      </section>`
    })
  }
```

---

## Cost to Image

In the `costToImage()` function it renders the value that comes out of `data.cards.attacks` as an empty `<i>` element with the type as a class.

JS image output HTML

```javascript
function costToImage(cost) {
  if (cost === undefined) {
    return
  }
  var totalCost = ''
  cost.forEach(function(element) {
    totalCost += `<i class='energy ${element.toLowerCase()}'></i>`
  })
  return totalCost
}
```

## Type Symbol Spriting

The app uses a sprite to render the image of any type symbol. The `costToImage(lightning)` function renders

`<i class='energy lightning'>`

where lightning corresponds to the sprite class in css.
