import type { InfoBlock, InfoCell } from '../data/blocks'
import { SmartLink } from './SmartLink'

// A data table from a doc (ARTAS vs FUT vs manual FUE, the healing timeline, the treatments open to international
// patients). Phones get stacked cards, one per row, each value under its column heading, so nothing scrolls sideways;
// from tablet up it is a real <table> with the first column as row headers. Cells may be a run of links.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

function Cell({ cell }: { cell: InfoCell }) {
  if (typeof cell === 'string') return <>{cell}</>
  return (
    <>
      {cell.map((link, i) => (
        <span key={link.label}>
          {link.href ? (
            <SmartLink href={link.href} className="text-secondary underline decoration-tertiary/60 underline-offset-4 transition-colors hover:text-primary">
              {link.label}
            </SmartLink>
          ) : (
            link.label
          )}
          {i < cell.length - 1 ? ', ' : ''}
        </span>
      ))}
    </>
  )
}

const cellKey = (cell: InfoCell) => (typeof cell === 'string' ? cell : cell.map((l) => l.label).join('|'))

export function InfoTable({ table }: { table: NonNullable<InfoBlock['table']> }) {
  const [, ...valueHeads] = table.head
  return (
    <div className="w-full text-left">
      <ul className="flex flex-col gap-5 md:hidden">
        {table.rows.map(([first, ...rest]) => (
          <li key={cellKey(first)} className="flex flex-col gap-4 rounded-[20px] border border-border px-5 py-6">
            <p className="font-heading text-h5 text-secondary uppercase">
              <Cell cell={first} />
            </p>
            <dl className="flex flex-col gap-3">
              {rest.map((cell, i) => (
                <div key={`${valueHeads[i]}-${i}`} className="flex flex-col gap-1">
                  <dt className="text-meta text-tertiary uppercase">{valueHeads[i]}</dt>
                  <dd className="text-small">
                    <Cell cell={cell} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-[20px] border border-border md:block">
        <table className="w-full border-collapse text-small">
          <thead className="bg-alternate">
            <tr>
              {table.head.map((h, i) => (
                <th key={`${h}-${i}`} scope="col" className="px-5 py-4 text-left align-bottom font-heading text-h6 font-medium text-secondary uppercase xl:px-[30px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([first, ...rest]) => (
              <tr key={cellKey(first)} className="border-t border-border align-top">
                <th scope="row" className="px-5 py-4 text-left font-medium text-secondary xl:px-[30px] xl:py-5">
                  <Cell cell={first} />
                </th>
                {rest.map((cell, i) => (
                  <td key={i} className="px-5 py-4 xl:px-[30px] xl:py-5">
                    <Cell cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
