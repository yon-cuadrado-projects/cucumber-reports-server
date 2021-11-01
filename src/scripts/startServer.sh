scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

scriptParentFolder="$(dirname "$(dirname "$scriptFolder")")"

nodeModulesFolder="$scriptParentFolder"/node_modules
echo "node modules folder: $nodeModulesFolder"

if [ ! -d "$nodeModulesFolder" ]; then
    cd "$scriptParentFolder";npm install;cd "$projectFolder"
fi

cd $scriptParentFolder;npx ts-node -r tsconfig-paths/register -T ./src/scripts/startServer.ts "$1"