import './ItemsCotainer.css'

export const ItemsCotainer = (Props) => {
  return (
    <div className="items-container">{Props.children}</div>
  )
}
export default ItemsCotainer