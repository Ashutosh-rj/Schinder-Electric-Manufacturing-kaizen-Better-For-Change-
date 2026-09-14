import asyncio
import logging
from asyncua import Server, ua

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mock_opc_server")

async def main():
    # Setup our server
    server = Server()
    await server.init()
    server.set_endpoint("opc.tcp://0.0.0.0:4840/freeopcua/server/")
    server.set_server_name("Mock KAIZEN DCS Server")

    # Setup our own namespace, not really necessary but should as spec
    uri = "http://kaizen.dcs.mock"
    idx = await server.register_namespace(uri)

    # Populating our address space
    objects = server.nodes.objects
    
    # Create a dummy object (e.g., Cement Mill Fan)
    cm_fan = await objects.add_object(idx, "CM-FAN-02")
    cm_fan_speed_node = f"ns={idx};s=CM-FAN-02.Speed.Setpoint"
    speed_var = await cm_fan.add_variable(cm_fan_speed_node, "Speed Setpoint", 100.0)
    await speed_var.set_writable()

    # Create Limestone Crusher (CR-401) based on HMI
    crusher = await objects.add_object(idx, "CR-401")
    crusher_feed_node = f"ns={idx};s=CR-401.FeedRate.Setpoint"
    feed_var = await crusher.add_variable(crusher_feed_node, "Feed Rate Setpoint", 850.0)
    await feed_var.set_writable()

    logger.info("Starting Mock OPC UA Server...")
    logger.info(f"Available tags: {cm_fan_speed_node} (value: {await speed_var.read_value()})")
    logger.info(f"Available tags: {crusher_feed_node} (value: {await feed_var.read_value()})")
    
    async with server:
        while True:
            await asyncio.sleep(1)
            # We could add simulation logic here if needed

if __name__ == "__main__":
    asyncio.run(main())
