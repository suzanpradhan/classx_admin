import { ProductsType } from '@/modules/products/productType';
import Image from 'next/image';

const ProductsDeatils = ({ products }: { products: ProductsType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden max-w-xl relative aspect-video">
        <Image
          src={products.thumbnail ?? '/default-thumbnail.jpg'}
          alt="cover image"
          fill
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4`}
      >
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Title</div>
          <div className="text-base capitalize text-black">{products.title}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Slug</div>
          <div className="text-base text-black">{products.slug}</div>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
              <div className="text-sm text-black">Artist</div>
              <div className="text-base text-black">{products.artist.name}</div>
            </div>  */}
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Release</div>
          <div className="text-base text-black">{products.release}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Price</div>
          <div className="text-base text-black">{products.price}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Product Type</div>
          <div className="text-base text-black">{products.product_type}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-black">Stock</div>
          <div className="text-base text-black">{products.stock}</div>
        </div>
      </div>


    </div>
  );
};

export default ProductsDeatils
