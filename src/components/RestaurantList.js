import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text, Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import slugify from 'slugify'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  restaurantNameText: {
    marginBottom: 5
  }
});

class RestaurantList extends Component {

  constructor(props) {
    super(props)
    this.matchingCounter = 0
  }

  renderItem(restaurant, index) {

    const asap =
      _.find(restaurant.availabilities, availability => {
        // Get the first date that is at least
        const diffInMinutes = moment(availability).diff(moment(), 'minutes')
        if (diffInMinutes <= 35) {

          return false
        }

        return true
      })

    let testID = `restaurants:${index}`
    if (restaurant.address.streetAddress.match(/75020/g)) {
      testID = `restaurantMatches:${this.matchingCounter}`
      this.matchingCounter += 1
    }

    return (
      <TouchableOpacity style={ styles.item }
        onPress={ () => this.props.onItemClick(restaurant, asap) }
        testID={ testID }>
        <Grid>
          <Col size={ 1 }>
            <Thumbnail size={60} source={{ uri: restaurant.image }} />
          </Col>
          <Col size={ 4 } style={{ paddingLeft: 10 }}>
            <Text
              style={ styles.restaurantNameText }>{ restaurant.name }</Text>
            <Text note>{ restaurant.address.streetAddress }</Text>
            <Text note style={{ fontWeight: 'bold' }}>
              { this.props.t('CHECKOUT_FROM', { date: moment(asap).format('dddd LT') }) }
            </Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    if (this.props.restaurants.length === 0) {

      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="search" style={{ color: '#cccccc' }} />
          <Text note>{ this.props.t('ENTER_ADDRESS') }</Text>
        </View>
      )
    }

    return (
      <View style={ styles.wrapper }>
        <FlatList
          testID="restaurantList"
          data={ this.props.restaurants }
          keyExtractor={ (item, index) => item['@id'] }
          renderItem={ ({ item, index }) => this.renderItem(item, index) } />
      </View>
    )
  }
}

export default withTranslation()(RestaurantList)
