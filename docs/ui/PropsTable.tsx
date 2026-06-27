import type { PropDef } from '../registry/types'

export function PropsTable({ props }: { props: PropDef[] }) {
  if (!props.length) return null
  return (
    <div className="doc-props">
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td>
                <code className="doc-props__name">{p.name}</code>
                {p.required && (
                  <span className="doc-props__req" title="Required">
                    *
                  </span>
                )}
              </td>
              <td>
                <code className="doc-props__type">{p.type}</code>
              </td>
              <td>
                {p.default ? (
                  <code className="doc-props__def">{p.default}</code>
                ) : (
                  <span className="doc-props__dash">—</span>
                )}
              </td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
