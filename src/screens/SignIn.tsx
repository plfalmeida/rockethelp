import { useState } from 'react';

import { Button } from '../components/Button';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';


import Logo from '../assets/logo_primary.svg'
import { Input } from '../components/Input';

export function SignIn() {
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')

	const { colors } = useTheme()

	const iconColor = colors.gray[300]

	function handleSignIn(){

	}

	return (
		<VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
			<Logo />
			<Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Acesse sua conta</Heading>

			<Input
				mb={4}
				placeholder='E-mail'
				InputLeftElement={<Icon ml={4} as={<Envelope color={iconColor} />} />}
				onChangeText={setName}
			/>
			<Input
				mb={8}
				placeholder='Senha'
				InputLeftElement={<Icon ml={4} as={<Key color={iconColor} />} />}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<Button title="Entrar" w="full" onPress={handleSignIn} />
		</VStack>
	)
}