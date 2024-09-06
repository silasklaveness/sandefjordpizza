export default function AddToCartButton({
  hasSizesOrExtras,
  onClick,
  basePrice,
}) {
  return (
    <button
      type="button"
      className="bg-primary text-white rounded-full px-8 py-2 mt-4"
      onClick={onClick}
    >
      {hasSizesOrExtras ? (
        <span>Legg til (fra {basePrice}kr)</span>
      ) : (
        <span>Legg til ${basePrice}</span>
      )}
    </button>
  );
}
