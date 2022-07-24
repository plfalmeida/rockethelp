import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleWavyCheck, Hourglass, ClipboardText, DesktopTower } from 'phosphor-react-native';
import FireStore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { OrderFireStoreDTO } from '../DTOs/OrderFireStoreDTO';
import { dateFormat } from '../utils/fireStoreDateFormat';

type RouteParams = {
	orderId: string
}

type OrderDetails = OrderProps & {
	description: string
	solution: string
	closed: string | null
}

export function Details() {
	const route = useRoute()
	const navigation = useNavigation()
	const { colors } = useTheme()

	const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
	const [isLoading, setIsLoading] = useState(true)
	const [isClosing, setIsClosing] = useState(false)
	const [solution, setSolution] = useState('')

	const { orderId } = route.params as RouteParams;

	function handleOrderClose() {
		if (!solution) {
			return Alert.alert(
				'Solicitação',
				'Informe a solução para encerrar a solicitação'
			)
		}

		setIsClosing(true)

		FireStore()
			.collection<OrderFireStoreDTO>('orders')
			.doc(orderId)
			.update({
				status: 'closed',
				solution,
				closed_at: FireStore.FieldValue.serverTimestamp()
			})
			.then(() => {
				Alert.alert('Solicitação', 'Solicitação encerrada')
				navigation.goBack()
			})
			.catch((error) => {
				console.error(error)
				Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação')
				setIsClosing(false)
			})
	}

	useEffect(() => {
		FireStore()
			.collection<OrderFireStoreDTO>('orders')
			.doc(orderId)
			.get()
			.then(doc => {
				const { patrimony, description, status, solution, closed_at, created_at } = doc.data()
				const closed = closed_at ? dateFormat(closed_at) : null

				setOrder({
					id: doc.id,
					patrimony,
					description,
					solution,
					status,
					when: dateFormat(created_at),
					closed,
				})

				setIsLoading(false)
			})
	})

	if (isLoading) {
		return <Loading />
	}

	return (
		<VStack flex={1} bg="gray.700">

			<Box px={6} bg="gray.600">
				<Header title="solicitação" />
			</Box>

			<HStack bg="gray.500" justifyContent="center" alignItems="center" p={4}>
				{
					order.status === 'closed'
						? <CircleWavyCheck size={12} color={colors.green[300]} />
						: <Hourglass size={12} color={colors.secondary[300]} />
				}

				<Text
					ml={2}
					fontSize="sm"
					color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
					textTransform="uppercase"
				>
					{order.status === 'closed' ? 'finalizada' : 'em andamento'}
				</Text>
			</HStack>

			<ScrollView mx={5} showsVerticalScrollIndicator={false}>
				<CardDetails
					title="equipamento"
					description={`Patrimônio ${order.patrimony}`}
					icon={DesktopTower}
				/>

				<CardDetails
					title="descrição do problema"
					description={order.description}
					icon={ClipboardText}
					footer={`Registrado em ${order.when}`}
				/>

				<CardDetails
					title="solução"
					description={order.solution}
					footer={order.closed && `Encerrado em ${order.closed}`}
					icon={CircleWavyCheck}
				>
					{
						order.status === 'open' && (
							<Input
								placeholder='descrição da solução'
								onChangeText={setSolution}
								textAlignVertical="top"
								multiline
								h={24}
							/>
						)
					}
				</CardDetails>

			</ScrollView>

			{
				order.status === 'open' && (
					<Button
						title='Encerrar solicitação'
						onPress={handleOrderClose}
						isLoading={isClosing}
						m={5}
					/>
				)
			}
		</VStack>
	);
}