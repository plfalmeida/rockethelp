import { Center, Spinner } from 'native-base';


export function Loading() {
	return (
		<Center flex={1} bg="gra.700">
			<Spinner color="secondary" />
		</Center>
	)
}