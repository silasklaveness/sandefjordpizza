import Image from "next/image";
import Trash from "@/components/icons/Trash";
import { cartProductPrice } from "../AppContext";
export default function cartProduct({ product, onRemove, index }) {
  return (
    <div className="flex items-center gap-4 mb-2 border-b py-2">
      <div className="w-24">
        <Image
          width={200}
          height={200}
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="grow">
        <h3 className="font-semibold">{product.name}</h3>
        <div>
          {product.size && (
            <div className="text-sm">
              Size: <span>{product.size.name}</span>
            </div>
          )}
          {product.extras?.length > 0 && (
            <div className="text-sm text-gray-500">
              {product.extras.map((extra) => (
                <div key={extra.name}>
                  {extra.name} ${extra.price}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-lg font-semibold">{cartProductPrice(product)}</div>
      {!!onRemove && (
        <div className="ml-2">
          <button className="p-2" onClick={() => onRemove(index)} type="button">
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
