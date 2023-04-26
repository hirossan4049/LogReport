import { InputProps } from "@chakra-ui/react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useDebouncedCallback } from "use-debounce";

type Option = {
  label: string;
  value: string;
};

type Props = {
  onChange: (value?: string) => void;
} & InputProps;

export const GitHubRepositoryInput = ({ defaultValue, onChange }: Props) => {
  const loadOptions = useDebouncedCallback(
    (inputValue: string, callback: (options: Option[]) => void) => {
      if (inputValue === "") {
        callback([{ label: `${defaultValue}`, value: `${defaultValue}` }]);
        return;
      }
      const req = axios.get(
        `https://api.github.com/search/repositories?q=${inputValue}`
      );
      req.then((res) => {
        callback(
          res.data.items.map((item: any) => {
            return { label: item.full_name, value: item.full_name };
          })
        );
      });
    },
    200
  );

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      onChange={(e) => onChange(e?.label?.toString())}
      cacheOptions
      defaultOptions
      value={{ label: defaultValue, value: defaultValue }}
    />
  );
};
