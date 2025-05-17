import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        borderRadius: 16,
        padding: 12
    },
    image: {
        height: 100,
        width: 100,
        backgroundColor: 'grey'
    },
    content: {
        marginLeft: 12,
        flex:1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    }
})

type Props = {
    name: string
    description: string
    onPress: () => void
}

export const DeckCard = ({ name, description, onPress }: Props) => {
    return <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
            <View style={styles.image}></View>
            <View style={styles.content}>
                <Text style={styles.title}>{name}</Text>
                <Text numberOfLines={3}>{description}</Text>
            </View>
        </View>
    </TouchableOpacity>
}