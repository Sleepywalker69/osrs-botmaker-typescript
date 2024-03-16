Convert this Java code to a typescript .d.ts file. Use external references with naming intention instead of imports, maintain comments, and do not export anything. Only return the code block:


package net.runelite.api.events;

import lombok.Value;
import net.runelite.api.GraphicsObject;

/**
 * An event where a new {@link GraphicsObject} has been created.
 */
@Value
public class GraphicsObjectCreated
{
	/**
	 * The newly created graphics object.
	 */
	private final GraphicsObject graphicsObject;
}
