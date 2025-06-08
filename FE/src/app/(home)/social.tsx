import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import mainStyles from '@/src/styles/mainStyle';
import Post from '@/src/Components/Post';

const SocialScreen = () => {
    return(
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, {padding: 0}]}/>
            <View style={[mainStyles.bottomeSheet, {backgroundColor: 'transparent'}]}>
                <Post />
            </View>
        </SafeAreaView>
    )
}

export default SocialScreen