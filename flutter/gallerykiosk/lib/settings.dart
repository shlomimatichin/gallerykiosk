import 'package:shared_preferences/shared_preferences.dart';

Future<String> getServiceEndpoint() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString('serviceEndpoint') ?? 'https://43fn5f4bw7.execute-api.eu-central-1.amazonaws.com/dev';
}

Future setServiceEndpoint(String value) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('serviceEndpoint', value);
}

Future<String> getApiKey() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString('apiKey');
}

Future setApiKey(String value) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('apiKey', value);
}

Future<bool> getKioskMode() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getBool('kioskMode') ?? false;
}

Future setKioskMode(bool value) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setBool('kioskMode', value);
}
