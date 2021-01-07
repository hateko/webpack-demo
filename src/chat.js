import people from "./people.js"
import Icon from './code.png';

export function init() {
  const img = document.createElement("img")
  console.error(Icon)
  img.src = Icon;
  img.style = "background: #2B3A42; padding: 20px"
  img.width = 32
  document.body.appendChild(img)

  const root = document.createElement("div")
  root.innerHTML = `<p>There are ${people.length} people in the room.</p>`
  document.body.appendChild(root)
}