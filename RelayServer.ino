#include <SPI.h>
#include <Ethernet.h>

#include <multi_channel_relay.h>

#include <aREST.h>

// CS pin of ethernet shield
const uint8_t ethernetCS = 10;

// MAC address of the ethernet shield
const uint8_t mac[] = {
  0x2C, 0xF7, 0xF1, 0x08, 0x36, 0xDC
};

// ethernet server port
const uint16_t port = 80;

// serial baud rate
const uint16_t serialBaud = 9600;

// I2C address for relay module
const uint8_t relayAddress = 0x11;

// Initialize Ethernet server object
EthernetServer server(port);

// Initialize aREST
aREST rest = aREST();
  
// Initialize relay object
Multi_Channel_Relay relay;


void setup() {
  // Initialize ethernet shield
  Ethernet.init(ethernetCS);

  // Open serial communications and wait for port to open:
  Serial.begin(serialBaud);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println(F("Ethernet WebServer Example"));

  // start the Ethernet connection and the server:
  Ethernet.begin(mac); // no IP address given -> use DHCP

  // Check for Ethernet hardware present
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println(F("Ethernet shield was not found.  Sorry, can't run without hardware. :("));
    while (true) {
      delay(1); // do nothing, no point running without Ethernet hardware
    }
  }
  
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println(F("Ethernet cable is not connected."));
  }

  // start the server
  server.begin();
  Serial.print(F("server is at "));
  Serial.println(Ethernet.localIP());

  // Read relay module firmware version
  const uint8_t relayFirmware = relay.getFirmwareVersion();
  Serial.print(F("firmware version: "));
  Serial.print(F("0x"));
  Serial.print(relayFirmware, HEX);
  Serial.println();

  relay.begin(relayAddress);


  rest.function("state", getChannelState);
  rest.function("on",    setChannelOn);
  rest.function("off",   setChannelOff);

  Serial.println(F("End of setup()."));
}

int getChannelState(String params)
{
  return relay.getChannelState();
}

int setChannelOn(String params)
{
  const int channel = params.toInt();
  relay.turn_on_channel(channel);
  return relay.getChannelState();
}

int setChannelOff(String params)
{
  const int channel = params.toInt();
  if (channel <= 0 || channel > 4)
  {
    return -1;
  }
  relay.turn_off_channel(channel);
  return relay.getChannelState();
}

void loop() {
  // listen for incoming clients
  EthernetClient client = server.available();
  rest.handle(client);
}
