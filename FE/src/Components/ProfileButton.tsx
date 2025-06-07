import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const ProfileButton = () => {
    return (
        <Link href="/profile" asChild>
            <Pressable style={{ marginLeft: 16 }}>
                <MaterialCommunityIcons name="account-circle" size={24} color="#000" />
            </Pressable>
        </Link>
    )
}

export default ProfileButton;