import { Button as NBButton, Text, IButtonProps } from 'native-base';
import { ButtonProps } from 'react-native';

type Props = IButtonProps & {
	title: string
}

export function Button({ title, ...rest }: Props) {

	return (
		<NBButton
			h={14}
			bg="green.700"
			rounded="sm"
			_pressed={{ bg: 'green.500' }}
			{...rest}
		>
			<Text color="white" fontSize="sm">{title}</Text>
		</NBButton>
	);
}