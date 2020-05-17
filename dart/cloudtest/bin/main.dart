import 'package:cloudtest/cloudtest.dart' as cloudtest;

void main(List<String> arguments) async {
  await cloudtest.readStackOutputs();
  await cloudtest.test1();
}
