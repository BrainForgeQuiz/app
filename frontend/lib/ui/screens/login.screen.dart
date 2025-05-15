import 'package:flutter/cupertino.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: Container(
          decoration: BoxDecoration(
            //TODO: Styling needed! @Szaki Csak te vagy legyen szép
            //color: CupertinoDynamicColor(color: Color., darkColor: darkColor, highContrastColor: highContrastColor, darkHighContrastColor: darkHighContrastColor, elevatedColor: elevatedColor, darkElevatedColor: darkElevatedColor, highContrastElevatedColor: highContrastElevatedColor, darkHighContrastElevatedColor: darkHighContrastElevatedColor)
          ),
          child: const Text('Login'),
        ),
      ),
      child: SizedBox(
        width: context.size!.width,
        child: SizedBox(
          width: context.size!.width / 1.2 ?? 400,
          child: Container(
            decoration: BoxDecoration(
              color: const Color(0xFFf5f5f5),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                //TODO: Add logo here @Szaki Csak te vagy legyen szép
                const Text('Login'),
                const SizedBox(height: 20),
                CupertinoButton(
                  child: const Text('Login with Google'),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
