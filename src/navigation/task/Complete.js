import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import {
  Container, Content,
  Icon, Text, Footer,
  Label,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import {
  selectIsTaskCompleteFailure,
  selectSignatureScreenFirst,
  selectSignatures,
  selectPictures,
  deleteSignatureAt,
  deletePictureAt,
  markTaskDone,
  markTaskFailed } from '../../redux/Courier'
import { greenColor, redColor } from '../../styles/common'
import { doneIconName, failedIconName} from './styles/common'

const DELETE_ICON_SIZE = 32
const CONTENT_PADDING = 20

class CompleteTask extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notes: '',
    }
  }

  markTaskDone() {

    const task = this.props.navigation.getParam('task')
    const { notes } = this.state

    this.props.markTaskDone(this.props.httpClient, task, notes, () => {
      this.props.navigation.navigate(this.props.navigation.getParam('navigateAfter'))
    })
  }

  markTaskFailed() {

    const task = this.props.navigation.getParam('task')
    const { notes } = this.state

    this.props.markTaskFailed(this.props.httpClient, task, notes, () => {
      this.props.navigation.navigate(this.props.navigation.getParam('navigateAfter'))
    })
  }

  render() {

    const task = this.props.navigation.getParam('task')
    const success = this.props.navigation.getParam('success', true)
    const { signatureScreenFirst } = this.props

    const { width } = Dimensions.get('window')

    const imageSize = (width - 64) / 2
    const buttonIconName = success ? doneIconName : failedIconName
    const footerBgColor = success ? greenColor : redColor
    const footerText = success ? this.props.t('VALIDATE') : this.props.t('MARK_FAILED')
    const onPress = success ? this.markTaskDone.bind(this) : this.markTaskFailed.bind(this)

    return (
      <Container>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Label style={{ marginBottom: 5 }}>{ this.props.t('NOTES') }</Label>
          <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 16 }}>
            <TextInput multiline={ true } numberOfLines={ 3 }
              onChangeText={ text => this.setState({ notes: text }) } />
          </View>
        </View>
        <Content contentContainerStyle={ styles.content }>
          <View style={ styles.imagesContainer }>
          { this.props.signatures.map((base64, key) => (
            <View key={ `signatures:${key}` }
              style={ [ styles.image, { width: imageSize, height: imageSize }] }>
              <Image
                source={{ uri: `data:image/jpeg;base64,${base64}` }}
                style={{ width: (imageSize - 2), height: (imageSize - 2) }} />
              <TouchableOpacity
                style={ styles.imageDelBtn }
                onPress={ _ => this.props.deleteSignatureAt(key) }>
                <Icon type="FontAwesome5" name="times-circle" />
              </TouchableOpacity>
            </View>
          ))}
          { this.props.pictures.map((base64, key) => (
            <View key={ `pictures:${key}` }
              style={ [ styles.image, { width: imageSize, height: imageSize }] }>
              <Image
                source={{ uri: `data:image/jpeg;base64,${base64}` }}
                style={{ width: (imageSize - 2), height: (imageSize - 2) }} />
              <TouchableOpacity
                style={ styles.imageDelBtn }
                onPress={ _ => this.props.deletePictureAt(key) }>
                <Icon type="FontAwesome5" name="times-circle" />
              </TouchableOpacity>
            </View>
          ))}
          </View>
        </Content>
        <TouchableOpacity
          style={ styles.addPoDButton }
          onPress={ () => this.props.navigation.navigate('TaskCompleteProofOfDelivery', { task, signatureScreenFirst }) }>
          <Icon type="FontAwesome5" name="signature"
            style={ styles.addPoDButtonText } />
          <Text
            style={ [ styles.addPoDButtonText, { textAlign: 'center', marginHorizontal: 10 } ] }>
            { this.props.t('TASK_ADD_PROOF_OF_DELIVERY') }
          </Text>
          <Icon type="FontAwesome5" name="camera"
            style={ styles.addPoDButtonText } />
        </TouchableOpacity>
        <Footer style={{ alignItems: 'center', backgroundColor: footerBgColor }}>
          <TouchableOpacity style={ styles.buttonContainer } onPress={ onPress }>
            <View style={ styles.buttonTextContainer }>
              <Icon type="FontAwesome" name={ buttonIconName } style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{ footerText }</Text>
            </View>
          </TouchableOpacity>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: (CONTENT_PADDING + (CONTENT_PADDING - (DELETE_ICON_SIZE / 2))),
    paddingRight: (CONTENT_PADDING + (CONTENT_PADDING - (DELETE_ICON_SIZE / 2))),
    paddingBottom: CONTENT_PADDING,
    paddingLeft: CONTENT_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  form: {
    flex: 1,
    marginBottom: 10,
  },
  addPoDButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    maxHeight: '15%',
  },
  addPoDButtonText: {
    color: '#0074D9',
  },
  imagesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  image: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  imageDelBtn: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    top: -16,
    right: -16,
  },
})

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    taskCompleteError: selectIsTaskCompleteFailure(state),
    signatures: selectSignatures(state),
    pictures: selectPictures(state),
    signatureScreenFirst: selectSignatureScreenFirst(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    markTaskFailed: (client, task, notes, onSuccess) => dispatch(markTaskFailed(client, task, notes, onSuccess)),
    markTaskDone: (client, task, notes, onSuccess) => dispatch(markTaskDone(client, task, notes, onSuccess)),
    deleteSignatureAt: index => dispatch(deleteSignatureAt(index)),
    deletePictureAt: index => dispatch(deletePictureAt(index)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CompleteTask))
