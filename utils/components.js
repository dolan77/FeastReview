import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'

/**
 * Component used for headers
 * Pass two parameters as properties or else there will be error probably
 * @param title, name on top of header
 * @param onPress, function for the back arrow, usually navigate back
 */
export class FeastHeader extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (<View style={styles.header}>
            <TouchableOpacity onPress={this.props.onPress}>
                <Ionicons style={[styles.globalFont, styles.backArrow]} name='arrow-back-outline'/>
            </TouchableOpacity>
            <Text style={[styles.globalFont]}>{this.props.title}</Text>
        </View>);
    }
}

const styles = {
    globalFont:{
        color: colors.white,
        fontSize: 20,
        fontWeight: '500', 
    },
    header: {
        backgroundColor: colors.black,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backArrow: {
        fontSize: 40
    },
}