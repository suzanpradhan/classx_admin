import { useGetApiResponse } from "@/core/api/getApiResponse";
import { useAppDispatch } from "@/core/redux/clientStore";
import { Button, tableStyles } from "@/core/ui/zenbuddha/src/components";
import artistsApi from "@/modules/artists/artistsApi";
import { ArtistsType } from "@/modules/artists/artistsType";
import { ReleasesType } from "@/modules/releases/releasesType";
import Image from "next/image";
import { Eye, PencilSimpleLine, TrashSimple } from "phosphor-react";
import { Dispatch, SetStateAction, useEffect } from "react";


export default function RealesTableRow({props, toggleDeleteModel, setOnDelete}: {props: ReleasesType,setOnDelete: Dispatch<SetStateAction<string | undefined>>, toggleDeleteModel: (value: SetStateAction<boolean>) => void}) {
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (props.artist) {
          dispatch(artistsApi.endpoints.getEachArtists.initiate(props.artist?.toString()));
        }
      }, [dispatch, props.artist]);
    
      const artistsData = useGetApiResponse<ArtistsType>(
        `getEachArtists("${ props.artist ?  props.artist : undefined}")`
      );

  return (
    <tr  className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{props.id}</td>
              <td className={tableStyles.table_td}>
                  <div className="relative w-20 h-20 overflow-hidden rounded-md">
                    {props.cover && (
                      <Image
                        src={props.cover}
                        alt={props.title ?? ''}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/images/errors/placeholder.webp';
                        }}
                        fill
                        placeholder="blur"
                        blurDataURL={props.cover}
                        quality={75}
                        sizes="(max-width: 768px) 75vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
              <td className={tableStyles.table_td}>{props.title}</td>
              <td className={tableStyles.table_td}>{artistsData?.name}</td>
              <td className={tableStyles.table_td}>{props.genres && props.genres.length > 0 ? props.genres.map((props, index) => <div key={index} className='inline-block px-1 text-xs bg-slate-300 text-dark-500 rounded-sm mr-1'>{props.name}</div>) : ""}</td>
              <td className={tableStyles.table_td}>{props.release_type}</td>
              <td className={tableStyles.table_td}>{props.release_date}</td>
             
              <td className={`${tableStyles.table_td} flex gap-2 max-w-xs`}>
              <Button
                  className="h-8 w-8"
                   type="link"
                   href={`/admin/releases/${props.id}`}
                  buttonType="bordered"
                  prefix={<Eye size={18} weight="duotone" />}
                />
                <Button
                  className="h-8 w-8"
                  type="link"
                  href={`/admin/releases/mutate/${props.id}`}
                  prefix={<PencilSimpleLine size={15} weight="duotone" />}
                />
                <Button
                  className="h-8 w-8"
                  kind="danger"
                  type="button"
                  onClick={() => {
                    setOnDelete(props.id.toString());
                    toggleDeleteModel(true);
                  }}
                  prefix={<TrashSimple size={18} weight="duotone" />}
                />
              </td>
            </tr>
  )
}
