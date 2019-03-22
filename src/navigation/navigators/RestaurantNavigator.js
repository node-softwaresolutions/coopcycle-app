import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon, Text } from 'native-base'
import { createStackNavigator } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'
import HeaderRight from '../restaurant/components/HeaderRight'

const MainNavigator = createStackNavigator({
  RestaurantHome: {
    screen: navigation.RestaurantDashboard,
    navigationOptions: ({ navigation }) => {
      let title = ''
      if (navigation.state.params && navigation.state.params.restaurant) {
        title = navigation.state.params.restaurant.name
      }

      return {
        title,
        headerRight: (<HeaderRight navigation={ navigation } />),
        headerLeft: headerLeft(navigation)
      }
    }
  },
  RestaurantOrder: {
    screen: navigation.RestaurantOrder,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_ORDER_TITLE', { order: navigation.state.params.order }),
    })
  },
}, {
  initialRouteKey: 'RestaurantHome',
  initialRouteName: 'RestaurantHome',
  defaultNavigationOptions
})

const RestaurantSettingsStack = createStackNavigator({
  RestaurantSettingsHome: {
    screen: navigation.RestaurantSettings,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  RestaurantProducts: {
    screen: navigation.RestaurantProducts,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_PRODUCTS'),
    })
  },
  RestaurantOpeningHours: {
    screen: navigation.RestaurantOpeningHours,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_OPENING_HOURS'),
    })
  },
  RestaurantPrinter: {
    screen: navigation.RestaurantPrinter,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_PRINTER'),
    })
  }
}, {
  initialRouteName: 'RestaurantSettingsHome',
  defaultNavigationOptions
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  RestaurantOrderRefuse: {
    screen: navigation.RestaurantOrderRefuse,
    navigationOptions: ({ navigation }) => ({
      title: 'Refuse order', // TODO Translate
    })
  },
  RestaurantOrderDelay: {
    screen: navigation.RestaurantOrderDelay,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_ORDER_DELAY_MODAL_TITLE'),
    })
  },
  RestaurantOrderCancel: {
    screen: navigation.RestaurantOrderCancel,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_ORDER_CANCEL_MODAL_TITLE'),
    })
  },
  RestaurantDate: {
    screen: navigation.RestaurantDate,
    navigationOptions: ({ navigation }) => ({
      title: 'Choose date', // TODO Translate
    })
  },
  RestaurantList: {
    screen: navigation.RestaurantList,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANTS'),
    })
  },
  RestaurantSettings: {
    screen: RestaurantSettingsStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS'),
    })
  },
  RestaurantSettings: {
    screen: RestaurantSettingsStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS'),
    })
  },
}, {
  mode: 'modal',
  defaultNavigationOptions
})
