import { useState } from 'react';
import { Alert } from 'react-native';

import { Heading, Icon, useTheme, VStack } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';
import { Button } from '../components/Button';

import auth from '@react-native-firebase/auth';

import Logo from '../assets/logo_primary.svg';
import { Input } from '../components/Input';


export function SignIn() {
	const [isLoading, setIsLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { colors } = useTheme()

	const iconColor = colors.gray[300]

	function handleSignIn() {
		if (!email || !password) {
			return Alert.alert('Entrar', 'informe email e senha')
		}
		setIsLoading(true)

		auth()
			.signInWithEmailAndPassword(email, password)
			.catch((error) => {
				console.error(error)
				setIsLoading(false)

				if (['auth/invalid-email', 'auth/invalid-password'].includes(error.coder)) {
					return Alert.alert('Entrar', 'Email ou senha inválidos')
				}

				return Alert.alert('Entrar', 'Não foi possível entrar')
			})
	}

	return (
		<VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
			<Logo />
			<Heading color="gray.100" fontSize="xl" mt={20} mb={6}>Acesse sua conta</Heading>

			<Input
				mb={4}
				placeholder='E-mail'
				InputLeftElement={<Icon ml={4} as={<Envelope color={iconColor} />} />}
				onChangeText={setEmail}
			/>
			<Input
				mb={8}
				placeholder='Senha'
				InputLeftElement={<Icon ml={4} as={<Key color={iconColor} />} />}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<Button
				w="full"
				title="Entrar"
				onPress={handleSignIn}
				isLoading={isLoading}
			/>
		</VStack>
	)
}
