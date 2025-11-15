
// router factory that read the module name/ version and create the route passes

const path = require('path');
const fs = require('fs').promises;
const { kebabCase } = require('lodash');

class FastifyRouteFactory {
    constructor(fastifyInstance) {
        this.fastify = fastifyInstance;
        this.routeLogger = fastifyInstance.log.child({ component: 'route-factory' });
    }

    async loadModules(modulesPath) {
        try {
            const modules = await fs.readdir(modulesPath);

            for (const moduleName of modules) {
                const modulePath = path.join(modulesPath, moduleName);
                const stat = await fs.stat(modulePath);
                if (stat.isDirectory()) {
                    await this.loadModuleVersions(moduleName, modulePath);
                }
            }
        } catch (error) {
            this.routeLogger.error(` Failed to load modules: ${error.message}`);
            throw error;
        }
    }

    async loadModuleVersions(moduleName, modulePath) {
        try {
            const versions = (await fs.readdir(modulePath)).filter(item => item.startsWith('v'));
            for (const version of versions) {
                await this.registerRoutes(moduleName, version, path.join(modulePath, version));
            }
        } catch (error) {
            this.routeLogger.error(` Failed to load versions for module '${moduleName}': ${error.message}`);
        }
    }

    async registerRoutes(moduleName, version, versionPath) {
        const routePrefix = `/api/${kebabCase(moduleName)}/v${version.replace(/^v/, '')}`;
        const routesFile = path.join(versionPath, 'routes', 'index.js');

        try {
            await fs.access(routesFile); // Make sure the file exists

            delete require.cache[require.resolve(routesFile)];
            const routeHandler = require(routesFile);

        
            this.fastify.register(routeHandler, {
                prefix: routePrefix,
                ignoreTrailingSlash: true,
            });

        } catch (error) {
            this.fastify.log.warn(` Skipping ${moduleName}/${version} - routes not found or invalid: ${error.message}`);
        }
    }
}

module.exports = FastifyRouteFactory;
