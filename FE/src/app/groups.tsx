import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import mainStyles from '@/src/styles/mainStyle';
import GroupItem from '@/src/Components/GroupItem';

const GroupsScreen = () => {
    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
            <View style={mainStyles.bottomeSheet}>
                <GroupItem />
            </View>
        </SafeAreaView>
    )
}

export default GroupsScreen;