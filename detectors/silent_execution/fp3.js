const fs = require('fs');
const shelljs = require('shelljs')
const inquirer = require('inquirer')

const check = (platform) =>inquirer
    .prompt([
        {
            name: 'check',
            type: 'confirm',
            message: `请在打${platform}包之前检查面板根目录下out/${platform}/quec-dependencies.json里的依赖信息是否正确, 若有误请先修改依赖后再打包, 默认回车Yes, 输入No则打包动作会取消`,
            default: true
        },
    ])

const packagePanel = async (panelPath, panelVersion) => {
    try {

        const err = new Error();

        const versionNum = panelVersion.split('.');
        const regex = /^\d+$/;
        if (versionNum.length != 3 || !versionNum.every(element => regex.test(element))) {
            err.message = '面板版本号需满足a.b.c三位语义化规则, 请重新打包';
            throw err;
        }

        //依赖分析
        shelljs.cd(panelPath);
        shelljs.exec('yarn');

        console.log('开始依赖分析...');

        const data = fs.readFileSync(panelPath + '/package.json', 'utf8')
        const config = JSON.parse(data)

        let analysis_result = [];

        if (shelljs.test('-d', 'node_modules')) {
            shelljs.cd('node_modules');
            const paths = shelljs.find('**/package.json');
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const data = fs.readFileSync(path, 'utf8');
                try {
                    const package = JSON.parse(data);
                    const name = String(package?.name);
                    const version = String(package?.version);
                    if (name !== 'undefined' && version !== 'undefined') {
                        analysis_result.push({
                            name: name,
                            version: version
                        });
                    }
                } catch (error) {
                    console.log(`${path}组件package.json解析失败`);
                    console.log('失败原因: ' + error.message);
                }
            }
        }

        console.log('结束依赖分析');

        // 使用curl命令从oss获取文件信息
        const url = `http://quec-saas-app.oss-cn-shanghai.aliyuncs.com/panel/assets/quec-dependencies.json`
        const mapUrl = `http://quec-saas-app.oss-cn-shanghai.aliyuncs.com/panel/assets/quec-name-map.json`

        const callback = shelljs.exec(`curl -s ${url}`, { silent: true });
        const mapback = shelljs.exec(`curl -s ${mapUrl}`, { silent: true });

        if (callback.code !== 0) {
            err.message = '获取quec-dependencies.json失败';
            throw err;
        }

        if (mapback.code !== 0) {
            err.message = '获取quec-name-map.json失败';
            throw err;
        }

        // 解析oss返回的JSON数据，获取dependencies对象和map对象
        const quec_dependencies_json = JSON.parse(callback.stdout);
        const quec_name_map_json = JSON.parse(mapback.stdout);

        const quec_dependencies = [];
        for (const key in quec_dependencies_json) {
            if (quec_dependencies_json.hasOwnProperty(key) && Array.isArray(quec_dependencies_json[key])) {
                quec_dependencies.push(...quec_dependencies_json[key]);
            }
        }

        // console.log('quec_dependencies: \n' + JSON.stringify(quec_dependencies));

        //使用名称映射覆盖analysis_result对应元素
        analysis_result = analysis_result.map((item) => {
            if (quec_name_map_json.hasOwnProperty(item.name)) {
                return {
                    name: quec_name_map_json[item.name],
                    version: item.version
                };
            }
            return item;
        });

        let panel_dependencies = [];
        let panelDiff = [];
        let appDiff = [];

        quec_dependencies.forEach((item) => {
            const element = analysis_result.find((element) => element.name === item.name);
            if (element !== undefined) {
                panel_dependencies.push({
                    name: item.name,
                    version: element.version,
                    platform: item.platform
                });
                if (element.version !== item.version) {
                    panelDiff.push(element);
                    appDiff.push(item);
                }
            }
        });

        if (panelDiff.length > 0) {
            console.log('\n\x1b[33m', `以下是面板依赖组件版本和app依赖组件版本不一致的结果:\n${JSON.stringify(panelDiff, null, 2)}`);
            console.log('\x1b[0m');
            console.log('\x1b[32m', `app依赖组件版本:\n${JSON.stringify(appDiff, null, 2)}`);
            console.log('\x1b[0m');
        }

        let panel_dependencies_android = panel_dependencies.filter((item)=>{
            if (item.platform == 1 || item.platform == 3) {
                return item;
            }
        });
        let panel_dependencies_iOS = panel_dependencies.filter((item)=>{
            if (item.platform == 2 || item.platform == 3) {
                return item;
            }
        });

        // console.log('\npanel_dependencies_android: ' + JSON.stringify(panel_dependencies_android));
        // console.log('\npanel_dependencies_iOS: ' + JSON.stringify(panel_dependencies_iOS));

        //创建打包产物目录
        shelljs.cd(panelPath)
        shelljs.rm('-fr', 'out')
        shelljs.mkdir('out')
        shelljs.mkdir('out/iOS')
        shelljs.mkdir('out/android')
        //执行打包命令
        shelljs.exec('npx react-native bundle --entry-file index.js --bundle-output ./out/iOS/index.ios.bundle --sourcemap-output ./out/index.ios.bundle.map --platform ios --assets-dest ./out/iOS --dev false')
        shelljs.exec('npx react-native bundle --entry-file index.js --bundle-output ./out/android/index.android.bundle --sourcemap-output ./out/index.android.bundle.map --platform android --assets-dest ./out/android --dev false')

        //版本写回package.json
        config.version = panelVersion
        fs.writeFileSync(shelljs.pwd() + '/package.json', JSON.stringify(config, null, '\t'))

        const time = new Date()
        const timeStamp = time.getFullYear().toString() + '-' +
            (time.getMonth() + 1) + '-' +
            time.getDate().toString() + '-' +
            time.getHours().toString() + '-' +
            time.getMinutes().toString()

        //创建android quec-dependencies.json
        shelljs.cd('out/android')
        if (panel_dependencies_android.length > 0) {
            const androidJsonObj = {
                'name': config.name,
                'platform': 1,
                'version': panelVersion,
                'dependencies': panel_dependencies_android
            }
            fs.writeFileSync(shelljs.pwd() + '/quec-dependencies.json', JSON.stringify(androidJsonObj, null, '\t'))
        }
        let checkRes = await check('Android')
        if (checkRes.check) {
            //Android产物压缩
            const tarAndroidStr = config.name + '-android-' + timeStamp  + '-' + panelVersion + '.tar.gz'
            shelljs.exec(`tar --exclude=\".*\" -czvf ${tarAndroidStr} *`)
        }

        shelljs.cd('../..')

        //创建iOS quec-dependencies.json
        shelljs.cd('out/iOS')
        if (panel_dependencies_iOS.length > 0) {
            const iOSJsonObj = {
                'name': config.name,
                'platform': 2,
                'version': panelVersion,
                'dependencies': panel_dependencies_iOS
            }
            fs.writeFileSync(shelljs.pwd() + '/quec-dependencies.json', JSON.stringify(iOSJsonObj, null, '\t'))
        }

        checkRes = await check('iOS')
        if (checkRes.check) {
            //iOS产物压缩
            const tarIOSStr = config.name + '-iOS-' + timeStamp  + '-' + panelVersion + '.tar.gz'
            shelljs.exec(`tar --exclude=\".*\" -czvf ${tarIOSStr} *`)
        }

    } catch (error) {
        console.log('失败原因: ' + error.message)
        process.exit(1);
    }
}

module.exports = {
    packagePanel
}