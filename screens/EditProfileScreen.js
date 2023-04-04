import { Alert, StyleSheet, Text, TouchableOpacity, View, Button, Image, ImageBackground, TextInput, useState, Modal} from 'react-native'
import auth from '@react-native-firebase/auth';

import { useNavigation } from '@react-navigation/core';
import image from "../assets/feast_blue.png"

import * as React from 'react';
import * as firebase from '../utils/firebase'

import ImagePicker from 'react-native-image-crop-picker';
import colors from '../utils/colors';
import expertise from '../utils/expertise'
import dropdown from 'react-native-dropdown-picker'
import DropDownPicker from 'react-native-dropdown-picker';

export default function EditProfileScreen(){
    const user = auth().currentUser;

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [bio, setBio] = React.useState('');

    const [title, setTitle] = React.useState('');
    const [possibleTitles, setPossibleTitles] = React.useState([]);
    const [titleScroll, setTitleScroll] = React.useState(false);

    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [dropdownValue, setDropdownValue] = React.useState(null);



    const [avatarPath, setAvatarPath] = React.useState();

    React.useEffect(() => {
        getProfile();
        getAvatarDB();
        loadTitles();
        DropDownPicker.setTheme('DARK')
    }, [])

    /**
     * for loading all possible titles at start of page
     */
    function loadTitles(){
        expertise.getPossibleTitles(user.uid).then(result => {
            console.log("titles" + result);
            var formattedTitles = [];
            result.forEach((possibleTitle) => {
                formattedTitles.push({
                    label: possibleTitle, 
                    value: possibleTitle,
                    labelStyle: expertise.titleStyle(possibleTitle)
                })
            })
            setPossibleTitles(formattedTitles);
        });
    }

    /**
     * 
     * @param {value.nativeEvent.text} newValue - this is the value of the textbox
     */
    async function changeBio(newValue) {
        // push changes to database, backend can do that
        try {
            await firebase.dbUpdateOnce('users', user.uid, "bio", newValue);
        } catch (error) {
            console.log(error)
        }
    }

    // function that retrieves the bio from the firestore database
    async function getProfile() {
        // push changes to database, backend can do that
        try {
            const userProfile = await firebase.dbGet('users', user.uid);
            setBio(userProfile.bio)
            setTitle(userProfile.title)
        } catch (error) {
            console.log(error)
        }
    }


    // function that will update the bio on the user's screen
    const updateBio = (newValue) => {
        setBio(newValue)
        changeBio(newValue)
    }

    // Get user's previously uploaded profile picture from the database
    // Written by Kenny Du
    const getAvatarDB = async() => {
        try{
            await firebase.dbFileGetUrl('ProfilePictures/' + user.uid).then(
                url => {
                    setAvatarPath(url)
                    }
            )
        }
        catch (error){
            console.log(user.displayName, 'does not have a profile picture on db')
            await firebase.dbFileGetUrl('feast_blue.png').then(
                url => {
                    setAvatarPath(url)
                }
            )
        }
    }

        /**
     * Method that handle the user's ability to change their profile picture
     * Written by Kenny Du
     */
    const changePicture = async() => {
        try{
            await ImagePicker.openPicker({
                        width: 120,
                        height: 120,
                        cropping: true,
                        // includeBase64: true,
                        cropperCircleOverlay: true
                    }).then(image? image => {
                        setAvatarPath(image.path);
                        console.log('image: ', image);
                        firebase.dbFileAdd('ProfilePictures/' + user.uid, image.path)
                    }: console.log('cancelled'));
        }
        catch (error){
            console.log(error)
        }
        
    }

    const editTitle = () => {
        console.log(titleScroll)
        //edit
        if(!titleScroll){
            setTitleScroll(true);
        }

        //submit
        else {
            setTitleScroll(false);
            firebase.dbUpdateOnce("users", user.uid, "title", title ? title: "");
        }
    }

    return (
        <View style = {{flex: 1, backgroundColor: colors.backgroundDark}}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                
                setModalVisible(!modalVisible);
                }}>
                <View style = {styles.modalView}>
                    <View>
                        <Text style = {[styles.globalFont]}>Your new bio will be...</Text>
                    </View>

                    <TextInput
                    style={styles.input}
                    maxLength={100}
                    numberOfLines = {4}
                    onSubmitEditing={(value) => updateBio(value.nativeEvent.text)}
                    />
                    <Button
                    title="go back"
                    onPress={() => setModalVisible(!modalVisible)}
                    />
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.modalText}>100 characters max</Text>
                        <Text style={styles.modalText}>Press Submit before you click the go back button if you want to submit your changes to bio</Text>
                    </View>
                    
                </View>
            </Modal>

            <View style = {styles.container}>
                <View style={styles.horizontalLine}/>

                <View style = {styles.rowContainer}>
                    <View style = {styles.leftItem}>
                        <Text style={styles.profileLabel}>Profile Picture</Text>
                        <Image style = {[styles.profilePicture]} source ={{uri:avatarPath}}/>
                    </View>

                    <View style = {styles.rightItem}>
                        <TouchableOpacity style={styles.editButton} onPress = {() => {console.log('Pressed edit photo'); changePicture()}}>
                            <Text style={styles.editText}>Edit</Text>        
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={styles.horizontalLine}/>

                <View style = {styles.rowContainer}>
                    <View style = {styles.leftItem}>
                        <Text style={styles.profileLabel}>Username</Text>
                        <Text style={styles.globalFont}>{user.displayName}</Text>
                    </View>

                    <View style = {styles.rightItem}>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.horizontalLine}/>

                <View style = {styles.rowContainer}>
                    <View style = {styles.leftItem}>
                        <Text style={styles.profileLabel}>Title</Text>
                        {!titleScroll && <Text style={[styles.globalFont, expertise.titleStyle(title)]}>{title}</Text>}
                        {titleScroll && <DropDownPicker 
                            style={{width:200}}
                            open={dropdownOpen}
                            value={title}
                            items={possibleTitles}
                            setOpen={setDropdownOpen}
                            setValue={setTitle}
                            setItems={setPossibleTitles}
                        />}
                    </View>

                    <View style = {styles.rightItem}>
                        <TouchableOpacity style={titleScroll ? styles.submitButton: styles.editButton} onPress={() => {editTitle()}}>
                            {!titleScroll && <Text style={styles.editText}>Edit</Text>}
                            {titleScroll && <Text style={styles.submitText}>Submit</Text>}
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={styles.horizontalLine}/>

                <View style = {styles.rowContainer}>
                    <View style = {[styles.leftItem]}>
                        <Text style={styles.profileLabel}>Biography</Text>
                        <View style={[styles.bioBox]}>
                            <Text style={[styles.bioFont]}>{bio}</Text>
                        </View>
                    </View>

                    <View style = {styles.rightItem}>
                        <TouchableOpacity style={styles.editButton} onPress = {() => setModalVisible(true)}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.horizontalLine}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
		backgroundColor: colors.backgroundDarker,
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
        margin:15,
        borderRadius:10,
        borderColor: colors.black,
        borderWidth:2
	}, 
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftItem: {
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        flexGrow: 1,
        margin: 10,
        
    },
    rightItem: {
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        flexGrow: 1,
        margin:10,
        
    },
    bioSubscriptContent:{
        alignItems: 'center',
        paddingHorizontal: 15
    },
    editText: {
        color: colors.feastBlueDark,
        alignSelf: 'flex-end',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize:20
    },
    editButton: {
        backgroundColor: colors.backgroundDarkLight,
        alignSelf: 'flex-end',
        textAlign: 'right',
        paddingHorizontal:15,
        paddingVertical: 2,
        borderRadius:10,
        borderColor: colors.black,
        borderWidth:1,
    },
    submitText: {
        color: colors.white,
        alignSelf: 'flex-end',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize:20
    },
    submitButton: {
        backgroundColor: colors.feastBlueDark,
        alignSelf: 'flex-end',
        textAlign: 'right',
        paddingHorizontal:15,
        paddingVertical: 2,
        borderRadius:10,
        borderColor: colors.black,
        borderWidth:1,
    },
    globalFont:{
        color: colors.white,
        alignSelf: 'flex-start',
        fontSize: 20,
        fontWeight: '500', 
    },
    bioFont:{
        color: colors.white,
        alignSelf: 'flex-start',
        textAlign: 'left',
        fontSize: 14,
        fontWeight: '500',
        margin:5 ,
        
       
    },
    bioBox:{
        color: colors.white,
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        borderWidth:2,
        borderColor: colors.gray,
        marginVertical:5,
        borderRadius:5,
        width: 250
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 150,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: colors.feastBlue,
        alignSelf: 'flex-start',
        marginVertical:5
    },
    profileLabel:{
        color: colors.gray,
        alignSelf: 'flex-start',
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'bold'
    },
    horizontalLine:{
        height: 1, 
        width:250,
        backgroundColor: colors.gray
    },
    modalView: {
        margin: 20,
        height: 500,
        backgroundColor: colors.feastBlueDark,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
    },
    modalText: {
        color: 'white',
        fontWeight: '400',
        fontSize: 16
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color:'white'
    },
});