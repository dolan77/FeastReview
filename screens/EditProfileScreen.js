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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FeastHeader } from '../utils/components';

export default function EditProfileScreen(){
    const user = auth().currentUser;

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [bio, setBio] = React.useState('Loading...');
    const [currName, setCurrName] = React.useState('Loading...');

    const [title, setTitle] = React.useState('');
    const [possibleTitles, setPossibleTitles] = React.useState([]);
    const [titleScroll, setTitleScroll] = React.useState(false);

    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [newBio, setNewBio] = React.useState('');
    const [editName, setEditName] = React.useState('');
    const [newName, setNewName] = React.useState('');



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

    // function that retrieves the bio from the firestore database
    async function getProfile() {
        // push changes to database, backend can do that
        try {
            const userProfile = await firebase.dbGet('users', user.uid);
            setBio(userProfile.bio ? userProfile.bio: "")
            setNewBio(userProfile.bio ? userProfile.bio: "")
            setCurrName(userProfile.name ? userProfile.name: "")
            if(!Object.hasOwn(userProfile, 'title') || userProfile.title == null || userProfile.title.length <= 0){
                setTitle('No title selected!');
            }
            else {
                setTitle(userProfile.title)
            }

        } catch (error) {
            console.log(error)
        }
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
            console.log(currName, 'does not have a profile picture on db')
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

    /**
     * Edit the state of title as well as toggling the button between edit and submit
     */
    const editTitle = () => {
        console.log(titleScroll)
        //edit
        if(!titleScroll){
            setTitleScroll(true);
        }

        //submit
        else {
            setTitleScroll(false);
            firebase.dbUpdateCreate("users", user.uid, "title", title ? title: "");
        }
    }

    /**
     * functions as the edit and submit button depending on state for username
     */
    const toggleEditName = () => {
        if(!editName){ //edit
            setEditName(true);
            setNewName(currName);
        }
        else { //submit
            setEditName(false);
            firebase.dbUpdateOnce("users", user.uid, "name", newName);
            setCurrName(newName);
        }
    }

    /**
     * Sets the current bio to the edited bio and syncs to database
     */
    const submitBiography = () => {
        setBio(newBio); 
        setModalVisible(false);

        // push changes to database, backend can do that
        try {
            firebase.dbUpdateOnce('users', user.uid, "bio", newBio);
        } catch (error) {
            console.log(error)
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={[styles.globalFont]}>Cancel</Text>
                        </TouchableOpacity>
                        {bio != newBio && <Text style={styles.globalFont} onPress={() => submitBiography()}>Submit</Text>}
                        {bio == newBio && <Text style={[styles.globalFont, {color: colors.gray}]}>Submit</Text>}
                    </View>

                    <View style={{padding: 35}}>
                        <View>
                            <Text style = {[styles.globalFont]}>Your new bio will be...</Text>
                        </View>

                        <TextInput
                        style={styles.input}
                        maxLength={100}
                        numberOfLines = {4}
                        onChangeText={(value) => setNewBio(value)}
                        placeholder="Write your biography here..."
                        placeholderTextColor={colors.white}>
                            {bio}
                        </TextInput>
                        
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.modalText}>{newBio.length}/100</Text>
                        </View>
                    </View>


                    
                </View>
            </Modal>

            <FeastHeader title={"Edit Profile"} onPress={() => navigation.replace('Your Profile')}/>

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
                        {!editName && <Text style={[styles.globalFont, styles.leftText]}>{currName}</Text>}
                        {editName && <View style = {[styles.bioBox, {borderColor: colors.white}]}>
                            <TextInput style={styles.globalFont} maxLength={20} numberOfLines={1} onChangeText={(value) => setNewName(value)}>
                                {newName}
                            </TextInput>
                        </View>}
                    </View>

                    <View style = {styles.rightItem}>
                        <TouchableOpacity style={editName ? styles.submitButton: styles.editButton} onPress={() => {toggleEditName()}}>
                            {!editName && <Text style={styles.editText}>Edit</Text>}
                            {editName && <Text style={styles.submitText}>Submit</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.horizontalLine}/>

                <View style = {styles.rowContainer}>
                    <View style = {styles.leftItem}>
                        <Text style={styles.profileLabel}>Title</Text>
                        {!titleScroll && <Text style={[styles.globalFont, expertise.titleStyle(title), styles.leftText]}>{title}</Text>}
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

                        <Text style={[styles.bioFont]}>{bio}</Text>

                    </View>

                    <View style = {styles.rightItem}>
                        <TouchableOpacity style={styles.editButton} onPress = {() => {setModalVisible(true); setNewBio(bio)}}>
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
        marginTop: 0,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
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
    leftText: {
        alignSelf: 'flex-start',
        textAlign: 'left'
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
        borderColor: colors.backgroundDarker,
        marginVertical:5,
        borderRadius:5,
        width: 200,
        padding:5
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
        height: '100%',
        backgroundColor: colors.backgroundDark,

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