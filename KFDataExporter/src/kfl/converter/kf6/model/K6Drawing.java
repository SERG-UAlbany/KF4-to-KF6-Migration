package kfl.converter.kf6.model;

import java.awt.Point;
import java.awt.Rectangle;
import java.util.ArrayList;
import java.util.List;

public class K6Drawing extends K6Contribution {

	private transient List<ShapeRegistration> shapes = new ArrayList<ShapeRegistration>();

	class ShapeRegistration {
		K6Shape shape;
		Point location;
	}

	public void addShape(K6Shape shape, Point location) {
		ShapeRegistration registration = new ShapeRegistration();
		registration.shape = shape;
		registration.location = location;
		shapes.add(registration);
		recreate();
	}

	private void recreate() {
		String template = "<svg width='%WIDTH%' height='%HEIGHT%' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><title>Layer1</title>%CONTENT%</g></svg>";
		StringBuffer contents = new StringBuffer();
		Rectangle r = new Rectangle();
		for (ShapeRegistration shape : shapes) {
			contents.append(shape.shape.getSvg(shape.location));
			r.add(shape.shape.getSize(shape.location));
		}
		int w = Math.max(100, r.width);
		int h = Math.max(100, r.height);
		//System.out.println(w+","+h);
		String svg = template.replace("%WIDTH%", Integer.toString(w));
		svg = svg.replace("%HEIGHT%", Integer.toString(h));
		svg = svg.replace("%CONTENT%", contents.toString());
		data.put("svg", svg);
		// System.out.println(svg);
	}
}