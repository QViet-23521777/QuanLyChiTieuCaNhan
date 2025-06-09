import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const AddButton = () => {
    return (
        <Link href="/AddExpense" asChild>
            <Pressable style={{ marginRight: 16}}>
                <MaterialCommunityIcons name="plus" size={24} color="#000" />
            </Pressable>
        </Link>
    )
}

export default AddButton;