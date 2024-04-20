import { Avatar, Flex, HStack, Text } from "@chakra-ui/react";

interface ContributorProps {
  avatar: {
    url: string;
  };
  name: string;
  position: string;
}

export function Contributor(props: ContributorProps) {
  return (
    <HStack spacing={4}>
      {!!props?.avatar?.url && (
        <Avatar src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${props.avatar.url}`} />
      )}
      <Flex direction="column" align="flex-start" justify="center">
        <Text fontWeight="semibold">{props?.name}</Text>
        <Text color="rgba(36,31,71,0.8)">{props?.position}</Text>
      </Flex>
    </HStack>
  );
}
