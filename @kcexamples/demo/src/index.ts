import { hello } from "@kcexamples/hello"
import { getName } from "@kcexamples/world"

function main() {
	console.log(hello())
	console.log(hello(getName()))
	console.log(hello(getName("Custom Name")))
}

void main()
