import { HeroUiColors } from "@/types/enums";
import { CustomSelectProps } from "@/types/interfaces";
import { Select, SelectItem } from "@heroui/react";

export default function CustomSelect<T>({
  isDisabled,
  placeholder,
  color = HeroUiColors.Primary,
  selectedKeys,
  onChange,
  items,
  itemKey,
  itemLabel,
  classNames,
}: CustomSelectProps<T>) {
  return (
    <Select
      isDisabled={isDisabled || !items.length} // Disable if no data
      placeholder={placeholder}
      color={color}
      className={"max-w-xs justify-start " + classNames || ""}
      selectedKeys={selectedKeys}
      onChange={(e) => onChange(e.target.value)}
      startContent={
        items?.find((a) => a.slug === selectedKeys[0])?.icon || null
      }
    >
      {items && (
        <>
          {items?.length === 0 ? (
            <SelectItem key="placeholder" isDisabled>
              گزینه‌ای یافت نشد
            </SelectItem>
          ) : (
            items?.map((item) => (
              <SelectItem
                startContent={item.icon || null}
                key={String(item[itemKey])}
              >
                {String(item[itemLabel])}
              </SelectItem>
            ))
          )}
        </>
      )}
    </Select>
  );
}
