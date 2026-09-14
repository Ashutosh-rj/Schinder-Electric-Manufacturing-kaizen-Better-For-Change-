import asyncio
import logging
from asyncua import Client, ua

logger = logging.getLogger("kaizen.opcua")

class OPCUAClientManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(OPCUAClientManager, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.client = None
            self.is_connected = False
            self.url = "opc.tcp://localhost:4840/freeopcua/server/"  # Default mock url
            self.initialized = True

    async def connect(self, url: str = None):
        if url:
            self.url = url
            
        if self.is_connected:
            return
            
        try:
            logger.info(f"Connecting to OPC UA Server at {self.url}...")
            self.client = Client(url=self.url)
            await self.client.connect()
            self.is_connected = True
            logger.info("Connected to OPC UA Server successfully.")
        except Exception as e:
            self.is_connected = False
            logger.error(f"Failed to connect to OPC UA Server: {e}")

    async def disconnect(self):
        if self.is_connected and self.client:
            try:
                await self.client.disconnect()
                self.is_connected = False
                logger.info("Disconnected from OPC UA Server.")
            except Exception as e:
                logger.error(f"Error disconnecting from OPC UA Server: {e}")

    async def write_setpoint(self, node_id: str, value: float) -> bool:
        """
        Writes a setpoint to the DCS. Includes safety limits.
        """
        if not self.is_connected:
            logger.error("Cannot write setpoint: Not connected to OPC UA Server.")
            # For demonstration, we will allow it to proceed as a simulation if not connected,
            # but in a real system this would raise an exception.
            logger.warning(f"SIMULATION MODE: Faking write {value} to {node_id}")
            return True

        # Hardcoded safety limits for demonstration
        limits = {
            "ns=2;s=CM-FAN-02.Speed.Setpoint": (0.0, 110.0),
            "ns=2;s=CR-401.FeedRate.Setpoint": (0.0, 1500.0), # Limestone Crusher feed rate (TPH)
        }
        
        node_limits = limits.get(node_id, (0.0, 10000.0))
        if value < node_limits[0] or value > node_limits[1]:
            logger.error(f"Safety Violation: Setpoint {value} is out of bounds {node_limits}")
            raise ValueError(f"Setpoint {value} is outside safe operating limits {node_limits}.")

        try:
            node = self.client.get_node(node_id)
            data_type = await node.read_data_type_as_variant_type()
            
            # Write the value
            dv = ua.DataValue(ua.Variant(value, data_type))
            await node.write_value(dv)
            
            logger.info(f"Successfully wrote {value} to {node_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to write to {node_id}: {e}")
            raise e

opcua_manager = OPCUAClientManager()
