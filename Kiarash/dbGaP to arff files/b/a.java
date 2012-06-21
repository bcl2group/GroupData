package b;

import java.io.PrintStream;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CharsetEncoder;

public final class a
{
  public static long a = 1048576L;
  public static long b = 0L;
  public static int c = -1;
  public static int d = -2;
  public static int e = -3;
  public static int f = -6;
  public static int g = -7;
  public static String h = "@attribute ";
  public static String i = " { ";
  public static String j = " }\n";
  public static String k = "@relation ";
  private static Charset G;
  private static CharsetEncoder H = (a.G = Charset.forName("UTF-8")).newEncoder();
  private static CharsetDecoder I = G.newDecoder();
  public static int l = 0;
  public static int m = 1;
  public static int n = 2;
  public static int o = 3;
  public static boolean p = false;
  public static String q = "";
  public static boolean r = false;
  public static String s = "";
  public static boolean t = false;
  public static String u = "";
  public static String v = "";
  public static boolean w = false;
  public static String x = "";
  public static boolean y = false;
  public static String z = "";
  public static boolean A = false;
  public static long B = 30L * a;
  public static boolean C = false;
  public static boolean D = false;
  public static int E = 0;
  public static boolean F = true;

  public static ByteBuffer a(String paramString)
  {
    try
    {
      return H.encode(CharBuffer.wrap(paramString));
    }
    catch (Exception localException)
    {
      System.out.println("Exception in str_to_bb from RawToArffFast.java");
    }
    return null;
  }

  public static String a(ByteBuffer paramByteBuffer)
  {
    String str = null;
    try
    {
      int i1 = paramByteBuffer.position();
      str = I.decode(paramByteBuffer).toString();
      paramByteBuffer.position(i1);
    }
    catch (Exception localException)
    {
      System.out.println("Exception in bb_to_str from RawToArffFast.java");
      return "";
    }
    return str;
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     b.a
 * JD-Core Version:    0.6.0
 */