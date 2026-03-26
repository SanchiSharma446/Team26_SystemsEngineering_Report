import MarkdownRenderer from '../components/MarkdownRenderer'

export default function Testing() {
  // testing.md currently doesn't exist, will show the styled placeholder!
  return <MarkdownRenderer fileUrl="/docs/testing.md" title="Testing" />
}
