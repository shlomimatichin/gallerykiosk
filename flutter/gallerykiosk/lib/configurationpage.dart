import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:gallerykiosk/settings.dart';
import 'package:flutter_svg/svg.dart';

final Widget logoWidget = SvgPicture.asset(
  'assets/ic_launcher.svg',
  semanticsLabel: 'GalleryKiosk Logo'
);

class ConfigurationPage extends StatefulWidget {
  @override
  _ConfigurationPageState createState() => _ConfigurationPageState();
}

class _ConfigurationPageState extends State<ConfigurationPage> {
  bool ready = false;
  String serviceEndpoint;
  String apiKey;

  void loadPersistent() async {
    String gotServiceEndpoint = await getServiceEndpoint();
    String gotApiKey = await getApiKey();
    setState(() {
      serviceEndpoint = gotServiceEndpoint;
      apiKey = gotApiKey;
      ready = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!ready) {
      loadPersistent();
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text('loading'),
            ],
          ),
        ),
      );
    }
    final cursorColor = Theme.of(context).cursorColor;
    const sizedBoxSpace = SizedBox(height: 24);
    return Scaffold(
      body: Form(
        child: Scrollbar(
          child: SingleChildScrollView(
            dragStartBehavior: DragStartBehavior.down,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                sizedBoxSpace,
                logoWidget,
                sizedBoxSpace,
                TextFormField(
                  cursorColor: cursorColor,
                  decoration: InputDecoration(
                    filled: true,
                    icon: const Icon(Icons.vpn_key),
                    hintText: 'XXXXXXXXXXXX',
                    labelText: 'API Key',
                  ),
                  initialValue: apiKey,
                  onChanged: (value) {
                    setApiKey(value);
                  },
                ),
                sizedBoxSpace,
                TextFormField(
                  cursorColor: cursorColor,
                  decoration: InputDecoration(
                    filled: true,
                    icon: const Icon(Icons.cloud),
                    hintText: 'leave empty for default or https://...',
                    labelText: 'Service Endpoint',
                  ),
                  initialValue: serviceEndpoint,
                  onChanged: (value) {
                    setServiceEndpoint(value);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
