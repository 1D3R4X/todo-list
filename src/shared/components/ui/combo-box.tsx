import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState, useCallback, useMemo, forwardRef, useEffect } from 'react';

import { useDebounce } from '@/shared/hooks/use-debounce';
import { cn } from '@/shared/lib/utils';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from './command';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Skeleton } from './skeleton';

export type Option = {
  label: string;
  value: string;
  group?: string;
};

interface ComboboxProps {
  options: Option[];
  value?: string | string[];
  placeholder?: string;
  emptyMessage?: string;
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  width?: number;
  error?: boolean;
  disableSearch?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  searchFilter?: (value: string, search: string) => boolean;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value: controlledValue,
      placeholder = 'Select...',
      emptyMessage = 'No results found.',
      multiple = false,
      onChange,
      width = 200,
      className,
      buttonClassName,
      popoverClassName,
      error,
      disableSearch = false,
      isLoading = false,
      disabled = false,
      searchFilter,
      searchPlaceholder = 'Search...',
      onSearchChange,
      searchValue,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | string[]>(
      multiple ? [] : ''
    );
    const [search, setSearch] = useState(searchValue || '');

    const debouncedSearch = useDebounce(search);

    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleSelect = useCallback(
      (currentValue: string) => {
        let newValue: string | string[];
        if (multiple) {
          newValue = Array.isArray(value) ? [...value] : [];
          const index = newValue.indexOf(currentValue);
          if (index > -1) {
            newValue.splice(index, 1);
          } else {
            newValue.push(currentValue);
          }
        } else {
          newValue = currentValue === value ? '' : currentValue;
          setOpen(false);
        }
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      [multiple, value, onChange]
    );

    const getDisplayValue = useCallback(() => {
      if (multiple && Array.isArray(value)) {
        return value.length > 0
          ? options
            .filter((option) => value.includes(option.value))
            .map((option) => option.label)
            .join(', ')
          : placeholder;
      }
      return (
        options.find((option) => option.value === value)?.label || placeholder
      );
    }, [multiple, value, options, placeholder]);

    const selectedCount = useMemo(() => {
      return multiple ? value.length : 0;
    }, [multiple, value]);

    useEffect(() => {
      onSearchChange?.(debouncedSearch);
    }, [debouncedSearch, onSearchChange]);

    const filteredOptions = useMemo(() => {
      if (!debouncedSearch) return options;

      return options.filter((option) => {
        if (searchFilter) {
          return searchFilter(option.value, debouncedSearch.toLowerCase());
        }
        return option.label
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      });
    }, [options, debouncedSearch, searchFilter]);

    const groupedOptions = useMemo(() => {
      const groups: { [key: string]: Option[] } = {};
      filteredOptions.forEach((option) => {
        const group = option.group || '';
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
      });
      return groups;
    }, [filteredOptions]);

    return !isLoading ? (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={getDisplayValue()}
            className={cn(
              `w-[${width}px] relative justify-between truncate max-w-full flex-grow-0 flex-shrink-0`,
              error && 'border-red-500',
              buttonClassName
            )}
          >
            <span className="overflow-hidden text-ellipsis truncate flex-1 text-left">
              {!!selectedCount && (
                <span className="absolute left-[6px] top-[11px] bg-foreground text-background w-3 h-3 flex items-center justify-center text-[10px] rounded-full mr-1">
                  {selectedCount}
                </span>
              )}
              <span className="ml-1">{getDisplayValue()}</span>
            </span>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(`w-[${width}px] p-0 z-[999]`, popoverClassName)}
        >
          <Command className={cn(`w-[${width}px`, className)}>
            {!disableSearch && (
              <Input
                value={search}
                className="border-none focus:border-none focus:ring-0 focus:outline-none"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder={searchPlaceholder}
              />
            )}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <CommandGroup key={group} heading={group}>
                  {groupOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                      aria-selected={
                        multiple
                          ? Array.isArray(value) && value.includes(option.value)
                          : value === option.value
                      }
                    >
                      {option.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          multiple
                            ? Array.isArray(value) &&
                              value.includes(option.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                            : value === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    ) : (
      <Skeleton className="w-full h-9" />
    );
  }
);
