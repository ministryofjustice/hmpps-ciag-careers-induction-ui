export default function properCase(word: string): string {
  return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
}
