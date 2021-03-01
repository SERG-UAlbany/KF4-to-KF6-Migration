package kfl.converter.basic.app;

import java.io.PrintStream;

import kfl.converter.basic.model.BasicK4Link;
import kfl.converter.basic.model.BasicK4Object;
import kfl.converter.basic.model.BasicK4World;
import kfl.kf4serializer.serializer.IKFTupleProcessor;
import kfl.kf4serializer.serializer.KFSerializeFolder;

import org.zoolib.ZID;
import org.zoolib.ZTuple;

import clib.common.filesystem.CDirectory;

public class K4BasicWorldBuilder {

	private BasicK4World world;

	public K4BasicWorldBuilder() {
	}

	public BasicK4World getWorld() {
		return world;
	}

	private PrintStream missingLinkOut = System.out;

	public void build(CDirectory dir) throws Exception {
		System.out.println("dir" + dir);
		world = new BasicK4World();
		System.out.println("world"+world);
		missingLinkOut = new PrintStream(dir.findOrCreateFile(
				"missingLinkInBasicLog.txt").toJavaFile());
		System.out.println("missingLinkOut"+missingLinkOut);
		KFSerializeFolder folder = new KFSerializeFolder(dir);
		System.out.println("folder" + folder);
		folder.loadMeta();
		world.setName(folder.getLoginModel().getDBName());

		folder.processObjects(new IKFTupleProcessor() {
			public void processOne(ZID id, ZTuple tuple) throws Exception {
				processObject(id, tuple.getString("Object"), tuple);
			}
		});
		folder.processLinks(new IKFTupleProcessor() {
			public void processOne(ZID id, ZTuple tuple) throws Exception {
				processLink(id, tuple.getString("Link"), tuple);
			}
		});
	}

	private void processObject(ZID id, String type, ZTuple tuple) {
		BasicK4Object obj = new BasicK4Object(id, tuple);
		world.putObject(obj);
	}

	protected void processLink(ZID id, String type, ZTuple tuple) {
		BasicK4Object to = world.getObject(tuple.getZID("to").toString());
		BasicK4Object from = world.getObject(tuple.getZID("from").toString());
		if (to == null || from == null) {
			missingLinkOut.println("missing link from=" + from + ", to=" + to);
			missingLinkOut.println(tuple.toString());
			return;
		}
		BasicK4Link link = new BasicK4Link(id, tuple);
		link.to = to;
		to.addToLink(link);
		link.from = from;
		from.addFromLink(link);
		world.putLink(link);
	}
}
