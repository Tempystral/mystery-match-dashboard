export function capitalize(sentence?: String) {
  return sentence
    ?.split(" ")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}
