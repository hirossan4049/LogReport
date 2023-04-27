import { InputProps, HStack, Avatar, Text } from "@chakra-ui/react";
import axios from "axios";
import { memo } from "react";
import AsyncSelect from "react-select/async";
import { useDebouncedCallback } from "use-debounce";

type Option = {
  label: string;
  value: string;
  avatar_url?: string;
};

type Props = {
  onChange: (value?: string) => void;
} & InputProps;

const FormatOptionLabel = memo(({ option }: { option: Option }) => (
  <HStack>
    {option.avatar_url && (
      <Avatar h={6} w={6} name="" src={option.avatar_url} />
    )}
    <Text>{option.label}</Text>
  </HStack>
));

export const GithubUsernameInput = ({ defaultValue, onChange }: Props) => {
  const loadOptions = useDebouncedCallback(
    (inputValue: string, callback: (options: Option[]) => void) => {
      if (inputValue === "") {
        callback([{ label: `${defaultValue}`, value: `${defaultValue}` }]);
        return;
      }
      const req = axios.get(
        `https://api.github.com/search/users?q=${inputValue}`
      );
      req.then((res) => {
        callback(
          res.data.items.map((item: any) => {
            return {
              label: item.login,
              value: item.login,
              avatar_url: item.avatar_url,
            };
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
      formatOptionLabel={(option) => (
        <FormatOptionLabel option={option as Option} />
      )}
    />
  );
};
